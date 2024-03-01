import Public from '../publications/public.model.js';

export const existeCommentById = async (commentId = '', publicationId = '') => {
    const publication = await Public.findById(publicationId);

    if (!publication) {
        throw new Error(`The publication with ID: ${publicationId} does not exist`);
    }

    const comment = publication.comments.id(commentId);

    if (!comment) {
        throw new Error(`The comment with ID: ${commentId} does not exist in the publication`);
    }
};