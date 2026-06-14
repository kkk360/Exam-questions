const { execSync } = require('child_process')
const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const pkgPath = join(__dirname, '..', 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

function exec(cmd) {
  console.log(`\n> ${cmd}`)
  return execSync(cmd, { stdio: 'inherit', cwd: join(__dirname, '..') })
}

function execSilent(cmd) {
  return execSync(cmd, { cwd: join(__dirname, '..') }).toString().trim()
}

function parseVersion(version) {
  const [major, minor, patch] = version.split('.').map(Number)
  return { major, minor, patch }
}

function bumpVersion(version, type) {
  const { major, minor, patch } = parseVersion(version)
  switch (type) {
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'major':
      return `${major + 1}.0.0`
    default:
      return version
  }
}

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve))
}

async function main() {
  console.log('\n========================================')
  console.log('       智能出题系统 - 一键发版')
  console.log('========================================')
  console.log(`\n当前版本: v${pkg.version}`)

  console.log('\n请选择版本类型:')
  console.log('  1) patch - 小版本 (修复 Bug)')
  console.log(`     v${pkg.version} -> v${bumpVersion(pkg.version, 'patch')}`)
  console.log('  2) minor - 中版本 (新功能)')
  console.log(`     v${pkg.version} -> v${bumpVersion(pkg.version, 'minor')}`)
  console.log('  3) major - 大版本 (重大更新)')
  console.log(`     v${pkg.version} -> v${bumpVersion(pkg.version, 'major')}`)

  const choice = await ask('\n请输入选项 (1/2/3): ')

  let type
  switch (choice.trim()) {
    case '1':
      type = 'patch'
      break
    case '2':
      type = 'minor'
      break
    case '3':
      type = 'major'
      break
    default:
      console.log('无效选项')
      rl.close()
      process.exit(1)
  }

  const newVersion = bumpVersion(pkg.version, type)
  const tagName = `v${newVersion}`

  console.log(`\n版本号: v${pkg.version} -> v${newVersion}`)
  console.log(`标签: ${tagName}`)

  const releaseNotes = await ask('\n请输入更新说明 (可选，直接回车跳过): ')

  const confirm = await ask(`\n确认发版 v${newVersion} ? (y/n): `)
  if (confirm.trim().toLowerCase() !== 'y') {
    console.log('已取消')
    rl.close()
    process.exit(0)
  }

  rl.close()

  // 1. 更新 package.json 版本号
  console.log('\n[1/5] 更新版本号...')
  pkg.version = newVersion
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  // 2. 提交版本更新
  console.log('\n[2/5] 提交版本更新...')
  exec('git add package.json package-lock.json')
  exec(`git commit -m "release: v${newVersion}"`)

  // 3. 打包
  console.log('\n[3/5] 打包应用...')
  exec('npm run build:win')

  // 4. 创建 GitHub Release
  console.log('\n[4/5] 创建 GitHub Release...')
  const notes = releaseNotes.trim() || `Release v${newVersion}`
  const setupExe = join(__dirname, '..', 'dist', `smart-exam-system-${newVersion}.exe`)
  const blockmap = join(__dirname, '..', 'dist', `smart-exam-system-${newVersion}.exe.blockmap`)
  const latestYml = join(__dirname, '..', 'dist', 'latest.yml')

  exec(`gh release create ${tagName} --repo kkk360/Exam-questions --title "智能出题系统 v${newVersion}" --notes "${notes}" "${setupExe}" "${blockmap}" "${latestYml}"`)

  // 5. 推送
  console.log('\n[5/5] 推送到远程仓库...')
  exec('git push origin master')

  console.log('\n========================================')
  console.log(`  发版成功! v${newVersion}`)
  console.log(`  Release: https://github.com/kkk360/Exam-questions/releases/tag/${tagName}`)
  console.log('========================================\n')
}

main().catch((err) => {
  console.error('发版失败:', err.message)
  process.exit(1)
})
