import redis


def get_redis_client():

    client = redis.Redis(
        host="localhost",
        port=6379,
        decode_responses=True
    )

    return client