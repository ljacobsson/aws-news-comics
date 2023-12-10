## aws-news-comics
Bot that creates comic strips from the latest service announcements from AWS and posts them on X.

## Usage
Create an SSM Parameter Store SecretString named `/news-comics/tokens` with the following content:
```
{
    "appKey": "<Your Twitter app key>",
    "appSecret":  "<Your Twitter app secret>",
    "accessToken": "<Your Twitter access token>",
    "accessSecret": "<Your Twitter access secret key>",
    "openaiKey": "<Your OpenAI key>"
}
```

## Deploy
```
$ sam build && sam deploy --guided
```

## Architecture
![diagram](./image.png)

![image](https://github.com/ljacobsson/aws-news-comics/assets/7579097/4a35deff-8fdb-47af-9cba-1b1bf848cdae)
![image](https://github.com/ljacobsson/aws-news-comics/assets/7579097/7aeb9ae9-9402-4823-9f71-5fbc7eed8caf)

[@aws_news_comics](https://x.com/aws_news_comics)
