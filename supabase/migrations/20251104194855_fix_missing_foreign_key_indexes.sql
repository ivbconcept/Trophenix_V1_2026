/*
  # Fix Missing Foreign Key Indexes

  1. Performance Improvements
    - Add indexes for foreign keys that don't have covering indexes
    - Improves JOIN performance and foreign key constraint checks
  
  2. Indexes Added
    - `conversations.created_by` - Index for conversation creator lookups
    - `messages.parent_message_id` - Index for threaded message queries
    - `news.author_id` - Index for news author lookups
  
  3. Security
    - No changes to RLS policies
    - Only performance optimization
*/

-- Add index for conversations created_by foreign key
CREATE INDEX IF NOT EXISTS idx_conversations_created_by 
ON conversations(created_by);

-- Add index for messages parent_message_id foreign key
CREATE INDEX IF NOT EXISTS idx_messages_parent_message_id 
ON messages(parent_message_id);

-- Add index for news author_id foreign key
CREATE INDEX IF NOT EXISTS idx_news_author_id 
ON news(author_id);
