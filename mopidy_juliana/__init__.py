import logging
import pathlib

import pkg_resources

from mopidy import config, ext

__version__ = pkg_resources.get_distribution("Mopidy-Juliana").version

# TODO: If you need to log, use loggers named after the current Python module
logger = logging.getLogger(__name__)


class Extension(ext.Extension):

    dist_name = "Mopidy-Juliana"
    ext_name = "juliana"
    version = __version__

    def get_default_config(self):
        return config.read(pathlib.Path(__file__).parent / "ext.conf")

    def get_config_schema(self):
        schema = super().get_config_schema()
        # TODO: Comment in and edit, or remove entirely
        schema["data_dir"] = config.String()
        #schema["password"] = config.Secret()
        return schema

    def setup(self, registry):
        # You will typically only implement one of the following things
        # in a single extension.

        # TODO: Edit or remove entirely
        from .frontend import JulianaFrontend
        

        # TODO: Edit or remove entirely
        # from .backend import FoobarBackend
        # registry.add("backend", FoobarBackend)

        # TODO: Edit or remove entirely
        # registry.add(
        #     "http:static",
        #     {
        #         "name": self.ext_name,
        #         "path": str(pathlib.Path(__file__).parent / "static"),
        #     },
        # )

        registry.add(
            "http:app", {"name": self.ext_name, "factory": juliana_factory}
        )

        registry.add("frontend", JulianaFrontend)


##
# Frontend factory
##
def juliana_factory(config, core):
    from tornado.web import StaticFileHandler
    from .handlers import HttpHandler, ReactRouterHandler, WebsocketHandler

    path = pathlib.Path(__file__).parent / "static"

    return [
        (r"/http/([^/]*)", HttpHandler, {"core": core, "config": config}),
        (r"/ws/?", WebsocketHandler, {"core": core, "config": config}),
        (r"/assets/(.*)", StaticFileHandler, {"path": path / "assets"}),
        (r"/((.*)(?:css|js|json|map)$)", StaticFileHandler, {"path": path}),
        (r"/(.*)", ReactRouterHandler, {"path": path / "index.html"}),
    ]