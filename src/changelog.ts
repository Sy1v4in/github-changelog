import { Command } from 'commander'
import { type PullRequest, type Repository, pullRequestsForSha, pullRequestsForTag } from './github'
import { type ReportStyle, generateReport, isReportStyle } from './report'

const parseRepository = (spec: string): Repository => {
  const [owner, ...repositoryName] = spec.split('/')
  return { owner, repo: repositoryName.join('/') }
}

const setUpChangelogCommand = (program: Command): Command => {
  program
    .name('changelog')
    .version('0.0.1')
    .description('changelog CLI: returns the pull requests associated with a tag or a commit sha')
    .option('-s, --style <style>', 'Report style', 'slack')

  program
    .command('tag')
    .description('changelog from tag: returns all the Pull Requests merged for the supplied tag and the previous one')
    .argument('<tag>', 'the tag from which the pull requests are expected')
    .argument('<repo>', 'the github repository where the pull requests are requested (<owner>/<name>)', parseRepository)
    .action(async (tag, repo) => {
      const pullRequests = await pullRequestsForTag(repo, tag)
      const report = getReport(repo, pullRequests, program.opts().style)
      console.log(report)
    })

  program
    .command('sha')
    .description('changelog from sha: returns the Pull Request associated with the supplied commit sha')
    .argument('<sha>', 'commit sha from which the pull request is expected')
    .argument('<repo>', 'the github repository where the pull request is requested (<owner>/<name>)', parseRepository)
    .action(async (sha, repo) => {
      const pullRequests = await pullRequestsForSha(repo, sha)
      const report = getReport(repo, pullRequests, program.opts().style)
      console.log(report)
    })

  return program
}

const parseStyle = (expectedStyle: string): ReportStyle => {
  if (isReportStyle(expectedStyle)) return expectedStyle
  throw new Error(`"${expectedStyle}" is not a known type`)
}

const getReport = (repository: Repository, pullRequests: PullRequest[], expectedStyle: string): string => {
  try {
    const style = parseStyle(expectedStyle)
    return generateReport(repository, pullRequests, style)
  } catch (error) {
    return String(error)
  }
}

export { setUpChangelogCommand }
