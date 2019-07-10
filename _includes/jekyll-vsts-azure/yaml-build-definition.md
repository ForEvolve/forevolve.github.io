```yaml
queue:
  name: Hosted VS2017
  condition: succeeded()
steps:
- task: UseRubyVersion@0
  displayName: Use Ruby >= 2.4

- script: 'gem install jekyll bundler'
  displayName: Install Jekyll and bundler

- script: 'bundle install'
  displayName: Install Gems

- script: 'bundle exec jekyll build'
  displayName: Build

- task: CopyFiles@2
  displayName: Copy "_site" to staging directory
  inputs:
    SourceFolder: '_site'
    TargetFolder: '$(build.artifactstagingdirectory)'

- task: PublishBuildArtifacts@1
  displayName: 'Publish Artifact: _site'
  inputs:
    ArtifactName: '_site'
```
