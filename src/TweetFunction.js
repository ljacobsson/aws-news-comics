import OpenAI from 'openai';
import { TwitterApi } from 'twitter-api-v2';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
const ssmClient = new SSMClient({});
const ssmCommand = new GetParameterCommand({
    Name: '/news-comics/tokens', WithDecryption: true
});
const secretsResponse = await ssmClient.send(ssmCommand);
const secrets = JSON.parse(secretsResponse.Parameter.Value);

const twitterClient = new TwitterApi({
    appKey: secrets.appKey,
    appSecret: secrets.appSecret,
    accessToken: secrets.accessToken,
    accessSecret: secrets.accessSecret
}, {});

const openai = new OpenAI({ apiKey: secrets.openaiKey });

export async function handler(event) {
    const { title, link, tags } = event;

    const image = await openai.images.generate({
        prompt: `A comic strip for the following AWS annoucement: "${title}"`,
        model: "dall-e-3",
        size: "1024x1024",
        quality: 'standard',
        response_format: 'b64_json'
    });

    const imageBase64 = image.data[0].b64_json;
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const app = await twitterClient.readWrite;
    const mediaId = await app.v1.uploadMedia(imageBuffer, { type: 'png' });

    await app.v2.tweet(`${title}\n${link}\n\n${tags}`, { media: { media_ids: [mediaId] } });
}
