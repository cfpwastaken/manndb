export type Post = {
	content?: string;
	title: string
	slug: string
	description: string
	date: string
	tags: string[]
	published: boolean
	author: string;
	keyword: string;
	private: boolean;
}

export type TagInfo = {
	slug: string
	name: string
	keywords: string[]
	description: string
}