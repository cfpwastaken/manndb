export type Post = {
	content?: string;
	title: string
	slug: string
	description: string
	date: string
	tags: string[]
	published: boolean
	author: string;
}

export type TagInfo = {
	description: string
}