const authController = require('./auth.controller');

test('should authenticate user with valid credentials', () => {
	const credentials = { username: 'testuser', password: 'testpass' };
	const result = authController.authenticate(credentials);
	expect(result).toBe(true);
});

test('should not authenticate user with invalid credentials', () => {
	const credentials = { username: 'testuser', password: 'wrongpass' };
	const result = authController.authenticate(credentials);
	expect(result).toBe(false);
});