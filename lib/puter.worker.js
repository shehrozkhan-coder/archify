const PROJECT_PREFIX = 'archify_project_'

const jsonError = (status, message, extra = {}) => {
    return new Response(JSON.stringify({ error: message, ...extra }), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
}

const getUserId = async (userPuter) => {
    try {
        const user = await userPuter.auth.getUser();
        return user?.uuid || null;
    } catch (error) {
        return null
    }
}

// GET /api/projects/list
router.get('/api/projects/list', async ({ user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonError(401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if (!userId) return jsonError(401, 'Authentication failed');

        const keys = await userPuter.kv.list(PROJECT_PREFIX);
        const values = await Promise.all(
            keys.map(async (key) => await userPuter.kv.get(key))
        );

        return { projects: values.filter(Boolean) };

    } catch (error) {
        return jsonError(500, 'Failed to list projects', { message: error.message || 'Unknown error' })
    }
})

// GET /api/projects/get
router.get('/api/projects/get', async ({ request, user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonError(401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if (!userId) return jsonError(401, 'Authentication failed');

        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) return jsonError(400, 'Missing project id');

        const key = `${PROJECT_PREFIX}${id}`;
        const project = await userPuter.kv.get(key);

        if (!project) return jsonError(404, 'Project not found');

        return { project };

    } catch (error) {
        return jsonError(500, 'Failed to get project', { message: error.message || 'Unknown error' })
    }
})

// POST /api/projects/save
router.post('/api/projects/save', async ({ request, user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonError(401, 'Authentication failed');

        const body = await request.json();
        const project = body?.project;

        if (!project?.id || !project?.sourceImage) return jsonError(400, 'Project ID and source image are required');

        const payload = {
            ...project,
            updatedAt: new Date().toISOString(),
        }
        const userId = await getUserId(userPuter);
        if (!userId) return jsonError(401, 'Authentication failed');

        const key = `${PROJECT_PREFIX}${project.id}`
        await userPuter.kv.set(key, payload);

        return { saved: true, id: project.id, project: payload }

    } catch (error) {
        return jsonError(500, 'Failed to save project', { message: error.message || 'Unknown error' })
    }
})