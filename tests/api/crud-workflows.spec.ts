import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const USER_ID = Number(process.env.USER_ID || '1');

test.describe('FakeStore API CRUD Workflows', () => {
    test('Product create, update, and delete workflow @master @regression @api', async ({ request }) => {
        const product = RandomDataUtil.generateProductPayload();
        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: product });

        expect(createResponse.status(), 'Product creation should return HTTP 201').toBe(201);
        const created = await createResponse.json();
        expect(created.id, 'Created product ID should be returned').toBeTruthy();

        const updatedProduct = { ...RandomDataUtil.generateUpdatedProductPayload(), id: created.id };
        const updateRoute = Routes.UPDATE_PRODUCT.replace('{id}', String(created.id));
        const updateResponse = await request.put(`${BASE_URL}${updateRoute}`, { data: updatedProduct });

        expect(updateResponse.status(), 'Product update should return HTTP 200').toBe(200);
        const updated = await updateResponse.json();
        expect(updated.id).toBe(created.id);
        expect(updated.title).toBe(updatedProduct.title);
        expect(updated.price).toBe(updatedProduct.price);

        const deleteRoute = Routes.DELETE_PRODUCT.replace('{id}', String(created.id));
        const deleteResponse = await request.delete(`${BASE_URL}${deleteRoute}`);

        expect(deleteResponse.status(), 'Product deletion should return HTTP 200').toBe(200);
    });

    test('User create, update, and delete workflow @master @regression @api', async ({ request }) => {
        const user = RandomDataUtil.generateUserPayload();
        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: user });

        expect(createResponse.status(), 'User creation should return HTTP 201').toBe(201);
        const created = await createResponse.json();
        expect(created.id, 'Created user ID should be returned').toBeTruthy();

        const updatedUser = { ...RandomDataUtil.generateUserUpdatePayload(), id: created.id };
        const updateRoute = Routes.UPDATE_USER.replace('{id}', String(created.id));
        const updateResponse = await request.put(`${BASE_URL}${updateRoute}`, { data: updatedUser });

        expect(updateResponse.status(), 'User update should return HTTP 200').toBe(200);
        const updated = await updateResponse.json();
        expect(updated.id).toBe(created.id);
        expect(updated.username).toBe(updatedUser.username);
        expect(updated.email).toBe(updatedUser.email);

        const deleteRoute = Routes.DELETE_USER.replace('{id}', String(created.id));
        const deleteResponse = await request.delete(`${BASE_URL}${deleteRoute}`);

        expect(deleteResponse.status(), 'User deletion should return HTTP 200').toBe(200);
    });

    test('Cart create, update, and delete workflow @master @regression @api', async ({ request }) => {
        const cart = RandomDataUtil.generateCartPayload(USER_ID);
        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: cart });

        expect(createResponse.status(), 'Cart creation should return HTTP 201').toBe(201);
        const created = await createResponse.json();
        expect(created.id, 'Created cart ID should be returned').toBeTruthy();
        expect(created.userId).toBe(cart.userId);
        expect(created.products).toEqual(cart.products);

        const updatedCart = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        updatedCart.products[0].quantity = cart.products[0].quantity + 1;
        const updateRoute = Routes.UPDATE_CART.replace('{id}', String(created.id));
        const updateResponse = await request.put(`${BASE_URL}${updateRoute}`, { data: updatedCart });

        expect(updateResponse.status(), 'Cart update should return HTTP 200').toBe(200);
        const updated = await updateResponse.json();
        expect(updated.id).toBe(created.id);
        expect(updated.products[0].quantity).toBe(updatedCart.products[0].quantity);

        const deleteRoute = Routes.DELETE_CART.replace('{id}', String(created.id));
        const deleteResponse = await request.delete(`${BASE_URL}${deleteRoute}`);

        expect(deleteResponse.status(), 'Cart deletion should return HTTP 200').toBe(200);
    });
});