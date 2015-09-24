class Tweet

  include Clientable

  attr_reader :target_id, :target_handle, :target_name, :target_description, :user_mentions, :target_profile_image_url, :tweet_id

  def initialize(attributes)
    @tweet_id = attributes[:tweet_id]
    @target_id = attributes[:target_id]
    @target_handle = attributes[:target_handle]
    @target_name = attributes[:target_name]
    @target_description = attributes[:target_description]
    @created_at = attributes[:created_at]
    @user_mentions = attributes[:user_mentions]
    @text = attributes[:text]
    @target_profile_image_url = attributes[:target_profile_image_url]
    @links = attributes[:links]
    @text_keywords = attributes[:text_keywords]
    @title_keywords = attributes[:title_keywords]
  end

  def self.all_tweets(handle)
    Clientable.client.user_timeline(handle, { count: 40, include_rts: false }).map do |tweet|
      Tweet.new(self.tweet_info(tweet))
    end
  end

  protected

  def self.tweet_info(tweet)
    text = self.tweet_text(tweet)
    links = self.tweet_links(tweet)
    text_kwords = self.text_keywords(text).map!{|keyword| keyword.downcase}
    title_kwords = self.title_keywords(links).map!{|keyword| keyword.downcase}
    title_kwords.reject! {|keyword| text_kwords.include?(keyword)}
    {
      tweet_id: tweet.id.to_s,
      target_id: tweet.user.id,
      target_handle: tweet.user.screen_name,
      target_name: tweet.user.name,
      target_description: tweet.user.description,
      created_at: self.format_created_at(tweet),
      user_mentions: tweet.user_mentions,
      text: text,
      target_profile_image_url: self.profile_image_url(tweet),
      links: links,
      text_keywords: text_kwords, #self.text_keywords(text),
      title_keywords: title_kwords #self.title_keywords(links)
    }
  end

  def self.tweet_text(tweet)
    words = tweet.text.split(" ")
    words.delete_if { |word| word.match(/^\s*(#|$)|\b(http.*|https.*)\b/) }
    words.join(" ")
  end

  def self.tweet_links(tweet)
    urls = self.expanded_urls(tweet)
    urls.map { |url| Link.new(url) }
  end

  def self.expanded_urls(tweet)
    tweet.urls.map { |url| url.expanded_url.to_s }
  end

  def self.format_created_at(tweet)
    tweet.created_at.strftime("%B %-d, %Y")
  end

  def self.profile_image_url(tweet)
    tweet.user.profile_image_url.to_s
  end

  def self.text_keywords(text)
    text.keywords.rank.map { |word| word.text }
  end

  def self.title_keywords(links)
    # titles = links.reject!{ |link| link.title.match(/^\s*(#|$)|\b(http.*|https.*)\b/) }
    keywords = links.map do |link|
      title = self.split_title(link.title)
      title.keywords.rank.map { |word| word.text }
    end
    keywords.flatten
  end

  def self.split_title(title)
    title = title.split(" ")
    title.delete_if { |word| word.match(/^\s*(#|$)|\b(http.*|https.*)\b/) }
    title.join(" ")
  end

end
