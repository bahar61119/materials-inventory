interface EntityInterface {
    latestUpdateByUser: string;
    latestUpdateTime: string;

    withLatestUpdateByUser(latestUpdateByUser: string): EntityInterface;
    withLatestUpdateTime(latestUpdateTime: string): EntityInterface;
}