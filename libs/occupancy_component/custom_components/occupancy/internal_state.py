import logging

import homeassistant.util.dt as dt_util
from homeassistant.core import State

_LOGGER = logging.getLogger(__name__)


class InternalState:
    def __init__(self):
        self._state = {}

    def register_entity(self, entity_id, initial_state=None):
        self._state[entity_id] = {
            "state": initial_state,
            "last_updated": dt_util.utcnow(),
        }

    def get(self, entity_id):
        if entity_id not in self._state:
            raise Exception(f"Entity {entity_id} not found in internal state")

        return self._state[entity_id]["state"]

    def set(self, entity_id, state):
        if entity_id not in self._state:
            raise Exception(f"Entity {entity_id} not found in internal state")

        if isinstance(state, State):
            new_last_updated = state.last_updated
            current_last_updated = self._state[entity_id]["last_updated"]

            if new_last_updated > current_last_updated:
                self._state[entity_id]["state"] = state.state
                self._state[entity_id]["last_updated"] = state.last_updated
            else:
                _LOGGER.debug(
                    "State not updated because it's older than the current state"
                )
        else:
            self._state[entity_id]["state"] = state
            self._state[entity_id]["last_updated"] = dt_util.utcnow()

    def __str__(self) -> str:
        return self._state.__str__()
