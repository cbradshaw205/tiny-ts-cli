export const script = async (context, args?: any) => {
  context.spinner.start('Loading...');

  setTimeout(() => {
    context.spinner.text = 'Done Loading';
    context.spinner.succeed();

    context.spinner.start('Loading Gays')

    setTimeout(() => {
      context.spinner.text = 'Done Loading Gays';
      context.spinner.fail();
    }, 5000);
  }, 5000);
};

export const args = [
  {
    name: 'arg1',
    type: 'string',
    required: true
  }
];