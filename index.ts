#!/usr/bin/env bun
import { Command } from 'commander'
import { setUpChangelogCommand } from './src/changelog.ts'

setUpChangelogCommand(new Command()).parse(process.argv)
