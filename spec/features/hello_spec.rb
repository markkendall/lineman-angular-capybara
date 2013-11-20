require 'spec_helper'

describe 'The home page' do
  it 'says hello' do
    visit '/'
    expect(page).to have_content 'Hello, World!'
  end
end
