import child_process from 'child_process'

export function git(command: string) {
  return child_process.execSync(`git ${command}`, { encoding: 'utf8' }).trim();
}

const gitInfo = {
  GIT_VERSION: git('describe --always'),
  GIT_AUTHOR_DATE: git('log -1 --format=%aI')
}

export default gitInfo
