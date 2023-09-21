import { Eta } from 'eta'
import { PullRequest, Repository } from './github.ts'

const STYLES = {
  markdown: '*<%= it.repository.repo %>*\n<% it.pullRequests.forEach(pr => { %>• [[#<%= pr.number %>](<%= pr.url %>)] <%= pr.title %> \n<%}) %>',
  slack: '*<%= it.repository.repo %>*\n<% it.pullRequests.forEach(pr => { %>  - [<<%= pr.url %> | #<%= pr.number %>>] <%= pr.title %> \n<%}) %>'
}

export type ReportStyle = keyof typeof STYLES

const isReportStyle = (style: string): style is ReportStyle => Object.keys(STYLES).includes(style)

const generateReport = (repository: Repository, pullRequests: PullRequest[], style: ReportStyle): string =>
  new Eta().renderString(STYLES[style], { repository, pullRequests })

export { generateReport, isReportStyle }
