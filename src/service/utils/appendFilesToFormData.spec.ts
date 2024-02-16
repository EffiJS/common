import { appendFilesToFormData } from './appendFilesToFormData';

const formData = {
  data: {},
  append(key, value) {
    this.data[key] = value;
  },
};

describe('Append files to FormData object', () => {
  const file1 = {
    uri: 'http://file-1.com',
    size: 100,
    name: 'File 1',
    type: '.txt',
  };
  const file2 = {
    uri: 'http://file-2.com',
    size: 200,
    name: 'File 2',
    type: '.png',
  };

  test('Object data first', () => {
    const date = new Date();
    const data = {
      defined: {
        data: {
          date,
          file: file1,
          key: '1',
          files: [file1, file2],
        },
        formData: {
          data: {},
          append(key, value) {
            this.data[key] = value;
          },
        },
      },
      expected: {
        data: {
          date: date.toISOString(),
          file: 'file',
          key: '1',
          files: ['files[0]', 'files[1]'],
        },
        formData: {
          file: file1,
          'files[0]': file1,
          'files[1]': file2,
        },
      },
    };

    const after = appendFilesToFormData(data.defined.data, data.defined.formData);

    expect({
      data: after,
      formData: data.defined.formData.data,
    }).toEqual(data.expected);
  });

  test('Array first', () => {
    const data = {
      defined: {
        data: [file1, file2],
        formData: {
          data: {},
          append(key, value) {
            this.data[key] = value;
          },
        },
      },
      expected: {
        data: ['[0]', '[1]'],
        formData: {
          '[0]': file1,
          '[1]': file2,
        },
      },
    };

    const after = appendFilesToFormData(data.defined.data, data.defined.formData);

    expect({
      data: after,
      formData: data.defined.formData.data,
    }).toEqual(data.expected);
  });
});
