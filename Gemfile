source 'https://rubygems.org'

# You may use http://rbenv.org/ or https://rvm.io/ to install and use this version
ruby ">= 2.6.10"

# Exclude problematic versions of cocoapods and activesupport that causes build failures.
gem 'cocoapods', '>= 1.13', '!= 1.15.0', '!= 1.15.1'
gem 'activesupport', '>= 6.1.7.5', '!= 7.1.0'
gem 'xcodeproj', '< 1.26.0'
gem 'rexml', '>= 3.3.9'

# Security floors. concurrent-ruby was previously pinned to '< 1.3.4'; that range is
# vulnerable (GHSA / CVE fixed in 1.3.7) and 1.3.7 builds fine against cocoapods here.
# excon >= 1.5.0 requires fastlane >= 2.237.0, which relaxes faraday-excon's '< 1.0.0' cap.
gem 'concurrent-ruby', '>= 1.3.7'
gem 'excon', '>= 1.5.0'
 
# Ruby 3.4.0 has removed some libraries from the standard library.
gem 'bigdecimal'
gem 'logger'
gem 'benchmark'
gem 'mutex_m'

gem 'fastlane'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
