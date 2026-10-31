"""
Command Centre services package.
Re-exports CommandCentreService from the main service module for easy imports.
"""
from ..services_impl import CommandCentreService

__all__ = ['CommandCentreService']
