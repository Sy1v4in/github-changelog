import { Command } from 'commander'
import { generateReportForSha, generateReportForTag, Repository } from './github.ts'

const parseRepository = (spec: string): Repository => {
  const [owner, ...repositoryName] = spec.split('/')
  return { owner, repo: repositoryName.join('/') }
}

const program = new Command()

program
  .name('changelog')
  .version('0.0.1')
  .description('changelog CLI: returns the pull requests associated with a tag or a commit sha')

program
  .command('tag')
  .description('changelog from tag: returns all the Pull Requests merged for the supplied tag and the previous one')
  .argument('<tag>', 'the tag from which the pull requests are expected')
  .argument('<repo>', 'the github repository where the pull requests are requested (<owner>/<name>)', parseRepository)
  .action(async (tag, repo) => {
    const report = await generateReportForTag(repo, tag)
    console.log(report)
  })

program
  .command('sha')
  .description('changelog from sha: returns the Pull Request associated with the supplied commit sha')
  .argument('<sha>', 'commit sha from which the pull request is expected')
  .argument('<repo>', 'the github repository where the pull request is requested (<owner>/<name>)', parseRepository)
  .action(async (sha, repo) => {
    const report = await generateReportForSha(repo, sha)
    console.log(report)
  })

program.parse(process.argv)