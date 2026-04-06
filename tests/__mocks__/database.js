jest.mock('../src/config/supabase', () => ({
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
        order: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue({ data: [], count: 0, error: null })
        })
      })),
      order: jest.fn().mockReturnValue({
        range: jest.fn().mockResolvedValue({ data: [], count: 0, error: null })
      })
    })),
    insert: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ data: null, error: null })
      })
    }),
    update: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: null })
        })
      })
    }),
    delete: jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ error: null })
    })
  })),
  removeAllChannels: jest.fn()
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true)
}));

jest.mock('../src/config/jwt', () => ({
  jwtSecret: 'test_secret',
  jwtExpiresIn: '24h',
  jwtAlgorithm: 'HS256'
}));

const jwt = require('jsonwebtoken');
global.testToken = jwt.sign(
  { userId: 1, email: 'test@test.com' },
  'test_secret',
  { expiresIn: '24h' }
);
