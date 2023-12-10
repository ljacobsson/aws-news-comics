import Parser from 'rss-parser';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
const parser = new Parser();
const dynamodb = new DynamoDB();
export async function handler() {
    let feed = await parser.parseURL('https://aws.amazon.com/about-aws/whats-new/recent/feed/');

    for (const item of feed.items) {
        let tags;
        if (item.categories?.length > 0) {
            tags = item.categories[0].split(',').map(category => "#" + category.split('/')[1].replace(/-/g, ''));
        }
        await dynamodb.putItem({
            TableName: process.env.TABLE_NAME,
            Item: {
                'id': { S: item.guid },
                'title': { S: item.title },
                'link': { S: item.link },
                'tags': { S: tags.join(' ') }
            }
        });
    }
    return;
}
