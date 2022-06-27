import { Service } from '../service';
import { AppwriteException } from '../client';
import type { Models } from '../models';
import type { UploadProgress } from '../client';

type Payload = {
    [key: string]: any;
}

export class Databases extends Service {

        /**
         * List Documents
         *
         *
         * @param {string} databaseId
         * @param {string} collectionId
         * @param {string[]} queries
         * @param {number} limit
         * @param {number} offset
         * @param {string} cursor
         * @param {string} cursorDirection
         * @param {string[]} orderAttributes
         * @param {string[]} orderTypes
         * @throws {AppwriteException}
         * @returns {Promise}
         */
        async listDocuments<Document extends Models.Document>(databaseId: string, collectionId: string, queries?: string[], limit?: number, offset?: number, cursor?: string, cursorDirection?: string, orderAttributes?: string[], orderTypes?: string[]): Promise<Models.DocumentList<Document>> {
            if (typeof databaseId === 'undefined') {
                throw new AppwriteException('Missing required parameter: "databaseId"');
            }

            if (typeof collectionId === 'undefined') {
                throw new AppwriteException('Missing required parameter: "collectionId"');
            }

            let path = '/databases/{databaseId}/collections/{collectionId}/documents'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
            let payload: Payload = {};

            if (typeof queries !== 'undefined') {
                payload['queries'] = queries;
            }

            if (typeof limit !== 'undefined') {
                payload['limit'] = limit;
            }

            if (typeof offset !== 'undefined') {
                payload['offset'] = offset;
            }

            if (typeof cursor !== 'undefined') {
                payload['cursor'] = cursor;
            }

            if (typeof cursorDirection !== 'undefined') {
                payload['cursorDirection'] = cursorDirection;
            }

            if (typeof orderAttributes !== 'undefined') {
                payload['orderAttributes'] = orderAttributes;
            }

            if (typeof orderTypes !== 'undefined') {
                payload['orderTypes'] = orderTypes;
            }

            const uri = new URL(this.client.config.endpoint + path);
            return await this.client.call('get', uri, {
                'content-type': 'application/json',
            }, payload);
        }

        /**
         * Create Document
         *
         *
         * @param {string} databaseId
         * @param {string} collectionId
         * @param {string} documentId
         * @param {Omit<Document, keyof Models.Document>} data
         * @param {string[]} read
         * @param {string[]} write
         * @throws {AppwriteException}
         * @returns {Promise}
         */
        async createDocument<Document extends Models.Document>(databaseId: string, collectionId: string, documentId: string, data: Omit<Document, keyof Models.Document>, read?: string[], write?: string[]): Promise<Document> {
            if (typeof databaseId === 'undefined') {
                throw new AppwriteException('Missing required parameter: "databaseId"');
            }

            if (typeof collectionId === 'undefined') {
                throw new AppwriteException('Missing required parameter: "collectionId"');
            }

            if (typeof documentId === 'undefined') {
                throw new AppwriteException('Missing required parameter: "documentId"');
            }

            if (typeof data === 'undefined') {
                throw new AppwriteException('Missing required parameter: "data"');
            }

            let path = '/databases/{databaseId}/collections/{collectionId}/documents'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
            let payload: Payload = {};

            if (typeof documentId !== 'undefined') {
                payload['documentId'] = documentId;
            }

            if (typeof data !== 'undefined') {
                payload['data'] = data;
            }

            if (typeof read !== 'undefined') {
                payload['read'] = read;
            }

            if (typeof write !== 'undefined') {
                payload['write'] = write;
            }

            const uri = new URL(this.client.config.endpoint + path);
            return await this.client.call('post', uri, {
                'content-type': 'application/json',
            }, payload);
        }

        /**
         * Get Document
         *
         *
         * @param {string} databaseId
         * @param {string} collectionId
         * @param {string} documentId
         * @throws {AppwriteException}
         * @returns {Promise}
         */
        async getDocument<Document extends Models.Document>(databaseId: string, collectionId: string, documentId: string): Promise<Document> {
            if (typeof databaseId === 'undefined') {
                throw new AppwriteException('Missing required parameter: "databaseId"');
            }

            if (typeof collectionId === 'undefined') {
                throw new AppwriteException('Missing required parameter: "collectionId"');
            }

            if (typeof documentId === 'undefined') {
                throw new AppwriteException('Missing required parameter: "documentId"');
            }

            let path = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
            let payload: Payload = {};

            const uri = new URL(this.client.config.endpoint + path);
            return await this.client.call('get', uri, {
                'content-type': 'application/json',
            }, payload);
        }

        /**
         * Update Document
         *
         *
         * @param {string} databaseId
         * @param {string} collectionId
         * @param {string} documentId
         * @param {Partial<Omit<Document, keyof Models.Document>>} data
         * @param {string[]} read
         * @param {string[]} write
         * @throws {AppwriteException}
         * @returns {Promise}
         */
        async updateDocument<Document extends Models.Document>(databaseId: string, collectionId: string, documentId: string, data: Partial<Omit<Document, keyof Models.Document>>, read?: string[], write?: string[]): Promise<Document> {
            if (typeof databaseId === 'undefined') {
                throw new AppwriteException('Missing required parameter: "databaseId"');
            }

            if (typeof collectionId === 'undefined') {
                throw new AppwriteException('Missing required parameter: "collectionId"');
            }

            if (typeof documentId === 'undefined') {
                throw new AppwriteException('Missing required parameter: "documentId"');
            }

            if (typeof data === 'undefined') {
                throw new AppwriteException('Missing required parameter: "data"');
            }

            let path = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
            let payload: Payload = {};

            if (typeof data !== 'undefined') {
                payload['data'] = data;
            }

            if (typeof read !== 'undefined') {
                payload['read'] = read;
            }

            if (typeof write !== 'undefined') {
                payload['write'] = write;
            }

            const uri = new URL(this.client.config.endpoint + path);
            return await this.client.call('patch', uri, {
                'content-type': 'application/json',
            }, payload);
        }

        /**
         * Delete Document
         *
         *
         * @param {string} databaseId
         * @param {string} collectionId
         * @param {string} documentId
         * @throws {AppwriteException}
         * @returns {Promise}
         */
        async deleteDocument(databaseId: string, collectionId: string, documentId: string): Promise<{}> {
            if (typeof databaseId === 'undefined') {
                throw new AppwriteException('Missing required parameter: "databaseId"');
            }

            if (typeof collectionId === 'undefined') {
                throw new AppwriteException('Missing required parameter: "collectionId"');
            }

            if (typeof documentId === 'undefined') {
                throw new AppwriteException('Missing required parameter: "documentId"');
            }

            let path = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
            let payload: Payload = {};

            const uri = new URL(this.client.config.endpoint + path);
            return await this.client.call('delete', uri, {
                'content-type': 'application/json',
            }, payload);
        }
};
