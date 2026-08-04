import { Regex, type SomeCompanionConfigField } from '@companion-module/base'
import { Models } from './models/index.js'

export type ModuleConfig = {
	model: keyof typeof Models
	host: string
	port: number
	username: string
	password: string
}

export type Secrets = {
	password: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'dropdown',
			id: 'model',
			label: 'Device',
			width: 8,
			choices: Object.keys(Models).map((x) => ({
				id: x,
				label: x,
			})),
			default: Object.keys(Models)[0],
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 8,
			regex: Regex.IP,
			default: '192.168.1.100',
		},
		{
			type: 'number',
			id: 'port',
			label: 'Target Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 80,
		},

		{
			type: 'textinput',
			id: 'username',
			label: 'Username',
			width: 4,
			default: 'admin',
		},
		{
			type: 'secret-text',
			id: 'password',
			label: 'Password',
			width: 4,
		},
	]
}
