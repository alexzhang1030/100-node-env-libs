import mri from 'mri'
import cac, { CAC } from '../src'

describe('cac init', () => {
  test('cac create', () => {
    const cli = cac('cli')
    expect(cli).toBeInstanceOf(CAC)
    expect(cli.name).toBe('cli')
  })
})

describe('cac command', () => {
  test('add a sub command', () => {
    const cli = cac()
    cli.command('command one', 'desc2')
    expect(cli.commands.length).toBe(1)
    expect(cli.commands[0].rawName).toBe('command one')
    expect(cli.commands[0].description).toBe('desc2')
    cli.command('command two', 'desc3')
    expect(cli.commands.length).toBe(2)
  })
  test('add command action', () => {
    const cli = cac()
    cli.command('command one', 'desc1').action(() => {})
    expect(cli.commands[0].commandAction).toBeDefined()
  })
  test('add command option(s)', () => {
    const cli = cac()
    cli.command('command one', 'desc1').option('-o', 'option one').action(() => {})
    expect(cli.commands[0].options).toHaveLength(1)
    expect(cli.commands[0].options[0].rawName).toBe('-o')
  })
})

test('mri test', () => {
  const argv = ['_', 'd:\index.js', 'dev', 'server.ts', '--port', '3000', '--open']
  const result = mri(argv.slice(2), {
    boolean: ['open'],
    string: ['port'],
  })
  expect(result).toMatchInlineSnapshot(`
    {
      "_": [
        "dev",
        "server.ts",
      ],
      "open": true,
      "port": "3000",
    }
  `)
})

describe('simple parse', () => {
  const argv = ['_', 'd:\index.js', 'dev', 'server.ts', '--port', '3000', '--open']
  test('easy parse', () => {
    const cli = cac()
    let count = 0
    cli.command('dev', 'start Server')
      .action(() => {
        count += 1
      })
    cli.parse(argv)
    // if count == 1, it works
    expect(count).toBe(1)
  })

  test('if not match, wont execute action', () => {
    const cli = cac()
    let count = 0
    cli.command('start', 'start Server').action(() => {
      count++
    })
    expect(count).toBe(0)
  })

  test('support parse option', () => {
    const cli = cac()
    cli.command('dev').action((...args) => {
      expect(args).toMatchInlineSnapshot(`
        [
          "server.ts",
          {
            "open": true,
            "port": 3000,
          },
        ]
      `)
    })
    cli.parse(argv)
  })
})

describe('support brackets', () => {
  test('in command name, square brackets is optional, angle brackets is required ', () => {
    const cli = cac()
    cli.command('find', 'find brackets').action((brackets, options) => {
      expect(brackets).toMatchInlineSnapshot('"hello.ts"')
      expect(options).toMatchInlineSnapshot('{}')
    })
    cli.parse(['_', '_', 'find', 'hello.ts'])
  })
})
