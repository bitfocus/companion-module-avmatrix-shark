import type { ModuleSchema } from '../../main.js'
import type ModuleInstance from '../../main.js'
import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'

export function getPresetsDefinitions(_self: ModuleInstance): [CompanionPresetSection[], CompanionPresetDefinitions] {
	const structure: CompanionPresetSection[] = []
	const presets: CompanionPresetDefinitions<ModuleSchema> = {}
	return [structure, presets]
}
