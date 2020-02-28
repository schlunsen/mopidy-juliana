import pykka
import logging
import functools
from mopidy.core import CoreListener
from .mem import juliana

# import logger
logger = logging.getLogger(__name__)


class JulianaFrontend(pykka.ThreadingActor, CoreListener):
    def __init__(self, config, core):
        super().__init__()

        # Pass our Mopidy config and core to the IrisCore instance
        juliana.config = config
        juliana.core = core

    def on_start(self):
        juliana.start()

    def on_stop(self):
        juliana.stop()

    def track_playback_ended(self, tl_track, time_position):
        juliana.ioloop.add_callback(functools.partial(juliana.check_for_radio_update))

    def tracklist_changed(self):
        juliana.ioloop.add_callback(functools.partial(juliana.clean_queue_metadata))
