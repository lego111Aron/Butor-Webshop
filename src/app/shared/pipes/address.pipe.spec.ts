import { AddressFormatterPipe } from './address.pipe';

describe('AddressFormatterPipe', () => {
  let pipe: AddressFormatterPipe;

  beforeEach(() => {
    pipe = new AddressFormatterPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format address correctly', () => {
    const result = pipe.transform('  fő utca 12/a  ');
    expect(result).toBe('Fő Utca 12/a');
  });

  it('should handle empty input', () => {
    const result = pipe.transform('');
    expect(result).toBe('');
  });

  it('should handle already formatted input', () => {
    const result = pipe.transform('Fő Utca 12/A');
    expect(result).toBe('Fő Utca 12/a');
  });
});