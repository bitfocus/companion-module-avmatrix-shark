import createS8X from './S8X/index.js'
// import createS6 from './S6/index.js'

export const Models = {
	S8X: createS8X,
	// S6: createS6,
}

export type ModelType = keyof typeof Models
