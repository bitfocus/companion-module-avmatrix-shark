import type ModuleInstance from '../../main.js'
import type { DeviceModel } from '../types.js'
import { getActionsDefinitions } from './actions.js'
import { getFeedbacksDefinitions } from './feedbacks.js'
import { getPresetsDefinitions } from './presets.js'
import { getVariableDefinitions } from './variables.js'
import { S6Api } from './api.js'

function createS8X(self: ModuleInstance): DeviceModel<S6Api> {
	return {
		api: new S6Api(self),
		getActionsDefinitions,
		getFeedbacksDefinitions,
		getPresetsDefinitions,
		getVariableDefinitions,
	}
}

export default createS8X
