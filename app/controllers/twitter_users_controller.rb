class TwitterUsersController < ApplicationController

  def index
    attributes = {  uid: current_user.uid,
                    name: current_user.name,
                    profile_image: current_user.profile_image,
                    handle: current_user.handle,
                    location: current_user.location,
                    description: current_user.description}
    current_twitter_user = TwitterUser.new(attributes)
    target_twitter_user = TwitterUser.locate_target(current_user.target_tweets)
    connected_twitter_users = TwitterUser.connections(current_user.target_tweets, current_twitter_user, target_twitter_user)
    twitter_users = [current_twitter_user, target_twitter_user] + connected_twitter_users

    render json: twitter_users
  end

end
