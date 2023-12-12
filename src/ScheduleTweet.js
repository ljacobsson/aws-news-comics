import { SchedulerClient, CreateScheduleCommand } from '@aws-sdk/client-scheduler';
import { v4 } from 'uuid';
const scheduler = new SchedulerClient({});

export async function handler(event) {
    if (!event.Records[0].dynamodb.NewImage || event.Records[0].dynamodb.OldImage) {
        return;
    }
    const item = event.Records[0].dynamodb.NewImage;
    const title = item.title.S;
    const link = item.link.S;
    const tags = item.tags.S;

    await scheduler.send(new CreateScheduleCommand({
        Name: v4(),
        ActionAfterCompletion: 'DELETE',
        ScheduleExpression: `at(${new Date().toISOString().slice(0, 16)})`,
        State: 'ENABLED',
        FlexibleTimeWindow: {
            Mode: 'FLEXIBLE',
            MaximumWindowInMinutes: 60
        },
        Target: {
            Arn: process.env.TWEET_FUNCTION_ARN,
            Id: 'TweetFunction',
            RoleArn: process.env.TWEET_FUNCTION_ROLE_ARN,
            Input: JSON.stringify({ title, link, tags })
        }
    }));
}
