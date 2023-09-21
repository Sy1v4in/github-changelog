import { Octokit } from 'octokit'

const octokit = new Octokit({ auth: process.env.GH_TOKEN })

export type Repository = Readonly<{
  owner: string
  repo: string
}>

export type PullRequest = Readonly<{
  number: number
  title: string
  url: string
}>

const getPreviousTag = async (repository: Repository, referenceTag: string): Promise<string> => {
  const tags = await listTags(repository)
  const referenceIndex = tags.findIndex(tag => tag === referenceTag)
  return tags[referenceIndex + 1]
}

const listTags = async (repository: Repository): Promise<string[]> => {
  const tags = await octokit.rest.repos.listTags({ ...repository })
  return tags.data.map(tag => tag.name)
}

const getCommitsBetweenTwoTags = async (repo: Repository, referenceTag: string, previousTag: string): Promise<string[]> => {
  const commitsBetweenTwoTags = await octokit.rest.repos.compareCommits({
    ...repo,
    base: previousTag,
    head: referenceTag
  })
  return commitsBetweenTwoTags.data.commits.map(commit => commit.sha)
}

const getPullRequestsAssociatedWith = async (repo: Repository, commits: string[]): Promise<PullRequest[]> => {
  const allPRsLinkedToCommitResponses = await Promise.all(commits.map(
    async commit => await octokit.rest.repos.listPullRequestsAssociatedWithCommit({ ...repo, commit_sha: commit }))
  )
  return allPRsLinkedToCommitResponses
    .map(response => response.data)
    .flat()
    .filter((pr, index, allPrs) =>
      index === allPrs.findIndex(p => pr.id === p.id)
    )
    .filter(pr => pr.title !== 'Automatic release')
    .map(pr => ({ number: pr.number, title: pr.title, url: pr.html_url }))
}

const pullRequestsForTag = async (repository: Repository, tag: string): Promise<PullRequest[]> => {
  const previousTag = await getPreviousTag(repository, tag)
  const commitsBetweenTwoTags = await getCommitsBetweenTwoTags(repository, tag, previousTag)
  return await getPullRequestsAssociatedWith(repository, commitsBetweenTwoTags)
}

const pullRequestsForSha = async (repository: Repository, sha: string): Promise<PullRequest[]> =>
  await getPullRequestsAssociatedWith(repository, [sha])

export { pullRequestsForSha, pullRequestsForTag }
