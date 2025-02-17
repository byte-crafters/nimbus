import { createClient } from 'redis';

describe('Test redis connectors', () => {
    test('Test redis connector: write and read value', async () => {
        const client = await createClient({
            url: process.env.NIMBUS_REDIS_URL_LOCAL,
        })
            .on('error', (err) => console.log('Redis Client Error', err))
            .connect();

        await client.set('nimbus_key', 'nimbus_value');
        const value = await client.get('nimbus_key');

        expect(value).toEqual('nimbus_value');
        await client.disconnect();
    });
});
