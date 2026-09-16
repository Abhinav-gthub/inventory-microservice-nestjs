import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service'
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
jest.mock('@nestjs/typeorm', () => {
  const { Inject } = require('@nestjs/common');
  return {
    getRepositoryToken: jest.fn(() => 'MockRepository'),
    InjectRepository: jest.fn(() => Inject('MockRepository')), 
  };
});
describe('InventoryService', () => {
  let service: InventoryService;

  const mockProductRepo = {
    find: jest.fn().mockResolvedValue([{ id: 1, name: 'Gaming Mouse', stock: 50 }])
  }

  beforeEach(async ()=>{
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: 'MockRepository',
          useValue: mockProductRepo,
        },
      ]
    }).compile();
    service = module.get<InventoryService>(InventoryService);
  });

  it('should return an array of products', async ()=>{
    const result = await service.getAllProducts();
    expect(result).toEqual([{ id: 1, name: 'Gaming Mouse', stock: 50 }]);
    expect(mockProductRepo.find).toHaveBeenCalledTimes(1);
  })


});