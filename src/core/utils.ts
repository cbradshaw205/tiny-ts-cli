// Prints a particular sequence to the stream that reports the current cursor position to the application.
// Uses regex to extract the follwoing data into values.
// https://stackoverflow.com/a/71367096
export const getCursorPos = () => new Promise((resolve) => {
  const termcodes = { cursorGetPosition: '\u001b[6n' };

  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);

  const readfx = function () {
      const buf = process.stdin.read();
      const str = JSON.stringify(buf); // "\u001b[9;1R"
      const regex = /\[(.*)/g;
      const xy = regex.exec(str)[0].replace(/\[|R"/g, '').split(';');
      const pos = { rows: xy[0], cols: xy[1] };
      process.stdin.setRawMode(false);
      // Convert string values into numbers
      const rows = Number.parseInt(pos.rows);
      const cols = Number.parseInt(pos.cols);
      resolve({ rows, cols });
  }

  process.stdin.once('readable', readfx);
  process.stdout.write(termcodes.cursorGetPosition);
}) as Promise<{ rows: number, cols: number }>; 

export const sleep = (ms) => new Promise(r => setTimeout(r, ms));