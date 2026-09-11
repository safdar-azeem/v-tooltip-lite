import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url))
const distributionRoot = join(repositoryRoot, 'dist')
const clickoutPackageRoot = resolve(
   process.env.CLICKOUT_LITE_PACKAGE_DIR ?? fileURLToPath(new URL('../../clickout-lite/', import.meta.url))
)
const temporaryRoot = await mkdtemp(join(tmpdir(), 'v-tooltip-lite-packed-'))
const tarballDirectory = join(temporaryRoot, 'tarball')
const consumerRoot = join(temporaryRoot, 'consumer')
const tarballPath = join(tarballDirectory, 'v-tooltip-lite.tgz')
const clickoutTarballPath = join(tarballDirectory, 'clickout-lite.tgz')

try {
   await mkdir(tarballDirectory)
   await mkdir(consumerRoot)

   execFileSync('yarn', ['build'], {
      cwd: clickoutPackageRoot,
      stdio: 'inherit',
   })

   execFileSync('yarn', ['pack', '--filename', clickoutTarballPath], {
      cwd: clickoutPackageRoot,
      stdio: 'inherit',
   })

   execFileSync('yarn', ['pack', '--filename', tarballPath], {
      cwd: distributionRoot,
      stdio: 'inherit',
   })

   const tarballs = (await readdir(tarballDirectory)).filter((entry) => entry.endsWith('.tgz'))
   const expectedTarballs = ['clickout-lite.tgz', 'v-tooltip-lite.tgz']
   const unexpectedTarballs = tarballs.filter((entry) => !expectedTarballs.includes(entry))
   if (
      tarballs.length !== expectedTarballs.length ||
      unexpectedTarballs.length > 0 ||
      expectedTarballs.some((entry) => !tarballs.includes(entry))
   ) {
      throw new Error(
         `Expected candidate tarballs ${expectedTarballs.join(', ')}, found ${tarballs.join(', ')}`
      )
   }

   await writeFile(
      join(consumerRoot, 'package.json'),
      JSON.stringify(
         {
            name: 'v-tooltip-lite-packed-consumer',
            private: true,
            type: 'module',
            resolutions: {
               'clickout-lite': `file:${clickoutTarballPath}`,
            },
         },
         null,
         2
      )
   )

   execFileSync(
      'yarn',
      ['add', '--ignore-scripts', '--no-lockfile', '--non-interactive', tarballPath, 'vue@^3.5.0'],
      { cwd: consumerRoot, stdio: 'inherit' }
   )

   const [installedClickoutEntry, candidateClickoutEntry] = await Promise.all([
      readFile(join(consumerRoot, 'node_modules/clickout-lite/dist/index.js'), 'utf8'),
      readFile(join(clickoutPackageRoot, 'dist/index.js'), 'utf8'),
   ])
   if (installedClickoutEntry !== candidateClickoutEntry) {
      throw new Error('The temporary consumer did not install the candidate clickout-lite artifact')
   }

   execFileSync(
      process.execPath,
      [
         '--input-type=module',
         '-e',
         "const tooltip = await import('v-tooltip-lite'); if (!tooltip.default) { throw new Error('v-tooltip-lite did not expose its default component') }",
      ],
      { cwd: consumerRoot, stdio: 'inherit' }
   )
} finally {
   await rm(temporaryRoot, { recursive: true, force: true })
}
