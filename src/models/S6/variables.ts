import type { CompanionVariableDefinitions } from '@companion-module/base'

import type ModuleInstance from '../../main.js'

export type Resp = {
	code: number
	data: object
	message: string
}

export type Token = {
	token: string
	username: string
}

export function getVariableDefinitions(_self: ModuleInstance): CompanionVariableDefinitions {
	return {}
}
