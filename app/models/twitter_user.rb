class TwitterUser

  def initialize(attributes)
    @uid = attributes[:uid]
    @name = attributes[:name]
    @profile_image = attributes[:profile_image]
    @user_type = attributes.fetch(:user_type, "current")
  end

  def self.locate_target(tweets)
    
  end

  def self.top_three_mentions(tweets)

  end

end