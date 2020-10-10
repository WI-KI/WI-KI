import { defineConfig } from 'umi';
import CONFIG from '../../config-client';

export default defineConfig({
	title: CONFIG.title,
	nodeModulesTransform: {
		type: 'none',
	},
	hash: true,
	routes: [
		{
			exact: true,
			// name: 'Index',
			// icon: '',
			path: '/',
			component: '@/pages/index/index',
		},
		{
			exact: true,
			path: '/user',
			component: '@/pages/user/index/index',
		},
		{
			exact: true,
			path: 'user/settings',
			component: '@/pages/user/settings/index',
		},
		{
			exact: true,
			path: '/user/login',
			component: '@/pages/user/login',
		},
		{
			exact: true,
			path: '/user/logout',
			component: '@/pages/user/logout',
		},
		{
			exact: true,
			path: '/user/register',
			component: '@/pages/user/register',
		},
		{
			exact: true,
			path: '/user/forgot-password',
			component: '@/pages/user/forgot-password',
		},
		{
			exact: true,
			path: '/team',
			component: '@/pages/team/index',
		},
		{
			exact: true,
			path: '/team/manage/:id',
			component: '@/pages/team/manage/[id]',
		},
		{
			exact: true,
			path: '/archives',
			component: '@/pages/archives/index/index',
		},
		{
			exact: true,
			path: '/user/:username/archives/details/:archives_id',
			component: '@/pages/archives/details/[id]',
		},
		{
			exact: true,
			path: '/team/:team_id/archives/details/:archives_id',
			component: '@/pages/archives/details/[id]',
		},
		{
			exact: true,
			path: '/user/:username/archives/edit/:archives_id',
			component: '@/pages/archives/edit/[id]',
		},
		{
			exact: true,
			path: '/team/:team_id/archives/edit/:archives_id',
			component: '@/pages/archives/edit/[id]',
		},		
		{
			exact: true,
			path: '/article',
			component: '@/pages/article/index/index',
		},
		{
			exact: true,
			path: '/user/:username/article/details/:article_id',
			component: '@/pages/article/details/[id]',
		},
		{
			exact: true,
			path: '/team/:team_id/article/details/:article_id',
			component: '@/pages/article/details/[id]',
		},
		{
			exact: true,
			path: '/user/:username/article/edit/:article_id',
			component: '@/pages/article/edit/[id]',
		},
		{
			exact: true,
			path: '/team/:team_id/article/edit/:article_id',
			component: '@/pages/article/edit/[id]',
		},
		{
			exact: true,
			path: '/user/:username/article/history/:article_id',
			component: '@/pages/article/history/[id]',
		},
		{
			exact: true,
			path: '/team/:team_id/article/history/:article_id',
			component: '@/pages/article/history/[id]',
		},
		{
			exact: true,
			path: '/user/:username/article/:article_id/source/:md_id',
			component: '@/pages/article/source/[id]',
		},
		{
			exact: true,
			path: '/team/:team_id/article/:article_id/source/:md_id',
			component: '@/pages/article/source/[id]',
		},
		{
			exact: true,
			path: '/user/:username/article/:article_id/compare/:md_id1/:md_id2',
			component: '@/pages/article/compare/[id]',
		},
		{
			exact: true,
			path: '/team/:team_id/article/:article_id/compare/:md_id1/:md_id2',
			component: '@/pages/article/compare/[id]',
		},
		{ component: '@/pages/404' },
	],
	runtimePublicPath: true,
	publicPath: CONFIG.publicPath,
	proxy: CONFIG.proxy,
});
