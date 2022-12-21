
import ora from 'ora-classic';
import { Command, InvalidArgumentError } from 'commander';
// import { Script } from './models/script.model.js';
// import { Logger } from './logger.js';
import { Logger } from './core/logger';
import { Context } from './core/context';
import { Tasks } from './core/tasks';
import * as readline from 'readline'
import { stdout } from 'process';
/*
  context = {

    

  }


*/

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export const main = async (argv: string[]) => {
  console.clear();

  // await withTimeout(1000, '1');

  // await withTimeout(1000, '2');

  // const spinner1 = new Spinner();

  // await spinner1.withPromise(test(2000), '2');
  // await spinner.withPromise(test1(1000), '1');

  // await ora.promise(test(1000), 'Test1');
  // await ora.promise(test(1000), 'Test2');


  // const tasks = [
  //   {
  //     title: 'task 1',
  //     task: test(1000)
  //   },
  //   {
  //     title: 'task 2',
  //     task: test1(3000)
  //   },
  //   {
  //     title: 'task 3',
  //     task: test(1000)
  //   },
  // ];

  // // for (const task of tasks) {

  // // }

  // tasks[1].spinner.ora.prefixText = 'test\n'
  // tasks[1].spinner.ora.text = `${tasks[1].title}\n* test`;
  // tasks[1].spinner.ora.start();
  // tasks[1].spinner.ora.succeed();
  
  // const spinner = ora();
  // spinner.prefixText = '├';
  // spinner.start('Running foo...');
  // await test(1000);
  // spinner.succeed('Foo completed.');


  const tasks = new Tasks();

  const logger = new Logger();

  await tasks.exec({
    group: 'Test Group #1',
    withConcurrency: true,
    tasks: [
      {
        name: 'test1',
        promise: sleep(500)
      },
      {
        name: 'test2',
        promise: sleep(2300)
      },
      {
        name: 'test3',
        promise: sleep(1000)
      },
      {
        name: 'test4',
        promise: sleep(2400)
      },
      {
        name: 'test5',
        promise: sleep(2300)
      },
      {
        name: 'test6',
        promise: sleep(2200)
      },
    ]
  });

  console.log('Hello');
  console.log('Hello');
  console.log('Hello');
  console.log('Hello');

  await tasks.exec({
    group: 'Test Group #2',
    withConcurrency: false,
    tasks: [
      {
        name: 'test1',
        promise: sleep(500)
      },
      {
        name: 'test2',
        promise: sleep(2300)
      },
      {
        name: 'test3',
        promise: sleep(1000)
      },
      {
        name: 'test4',
        promise: sleep(2400)
      },
      {
        name: 'test5',
        promise: sleep(2300)
      },
      {
        name: 'test6',
        promise: sleep(2200)
      },
    ]
  });

  await tasks.exec({
    group: 'Test Group #3',
    withConcurrency: true,
    tasks: [
      {
        name: 'test1',
        promise: sleep(500)
      },
      {
        name: 'test2',
        promise: sleep(2300)
      },
      {
        name: 'test3',
        promise: sleep(1000)
      },
      {
        name: 'test4',
        promise: sleep(2400)
      },
      {
        name: 'test5',
        promise: sleep(2300)
      },
      {
        name: 'test6',
        promise: sleep(2200)
      },
    ]
  });




  console.log('Example logs');
  console.log('Exmaple logs');
  console.log('Example logs');

  await tasks.exec({
    group: 'Test Group #1',
    withConcurrency: true,
    tasks: [
      {
        name: 'test1',
        promise: sleep(500)
      },
      {
        name: 'test2',
        promise: sleep(2300)
      },
      {
        name: 'test3',
        promise: sleep(1000)
      },
      {
        name: 'test4',
        promise: sleep(2400)
      },
      {
        name: 'test5',
        promise: sleep(2300)
      },
      {
        name: 'test6',
        promise: sleep(2200)
      },
    ]
  });

  // console.log(__dirname);


  // const spinner1 = ora({ stream: process.stdout });
  // spinner1.text = 'Test1';
  // const spinner2 = ora({ stream: process.stdout });
  // spinner2.text = 'Test2';
  // const spinner3 = ora({ stream: process.stdout });
  // spinner3.text = 'Test3';


  // const test1 = () => {
  //   [spinner1, spinner2, spinner3].forEach((spinner, index) => {
  //     process.stdout.cursorTo(0, 1 + index);
  //     spinner.render()
  //   });
  // }

  // const id = setInterval(test1, 100);

  // await test(1000)

  // clearInterval(id);

  // console.log()

  // spinner.stopAndPersist()




  // const spinner = new Spinner();
  // spinner.ora.text = ''

//   console.log(
// `group1
// ┌ ✔ test1
// ├ * test2
// ├ * test3
// └ * test4`)

//   // readline.cursorTo(process.stderr, 1, null);
//   // readline.clearLine(process.stdout, 0);
//   //readline.clearLine(process.stdout);
//   readline.cursorTo(process.stdout, 0, 2);
//   const spinner = ora({ stream: stdout });
//   spinner.prefixText = '┌';
//   spinner.start('test1');
//   await test(1000);
//   spinner.succeed();
//   readline.cursorTo(process.stdout, 0, 6);

  // Argument Validation
  // const [command] = argv;
  
  // const cli = new Command();

  // cli.command('run')
  // .argument('<name>', 'name of script to run')
  // .action(async (options) => {
    
  // })

  // // cli = generateOptions(cli, args);

  // await cli.parseAsync(argv, { from: 'user' });

  // const context = new Context({});

  // const { spinner } = context;

  // spinner.start('Starting process');

  // setTimeout(() => {
  //   spinner.succeed('Yay');
  //   spinner.start('New Process');
  // }, 1000);

  // setTimeout(() => {
  //   spinner.fail('dang it');
  // }, 2000);

};

const generateOptions = (command: Command, options: { name: string, type: string, required: boolean }[]) => {

  function myParseInt(value, dummyPrevious) {
    // parseInt takes a string and a radix
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new InvalidArgumentError('Not a number.');
    }
    return parsedValue;
  }
  
  for (const { name, type, required } of options) {
    if (required) {
      command.requiredOption(`--${name} <value>`, 'Test description', myParseInt)
    } else {
      command.option(`${name} <value>`, 'Test description', myParseInt)
    }
  }

  return command;
}

main(process.argv.splice(2));
