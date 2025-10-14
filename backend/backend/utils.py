import configparser
import os

from backend import settings


def get_config():
    config = configparser.ConfigParser()
    config_path = os.path.join(settings.BASE_DIR, 'config.ini')
    config.read(config_path)
    return config


