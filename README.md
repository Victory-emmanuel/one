# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/451e601f-4f92-4b65-86f0-c8982ac7123a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/451e601f-4f92-4b65-86f0-c8982ac7123a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/451e601f-4f92-4b65-86f0-c8982ac7123a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Environment Variables

This project uses environment variables to store sensitive information like API keys and secrets. To set up your environment:

1. Copy the `.env.example` file to a new file named `.env`:
   ```sh
   cp .env.example .env
   ```

2. Update the values in the `.env` file with your own credentials if needed.

3. Make sure the `.env` file is included in your `.gitignore` to prevent it from being committed to version control.

Here's what each environment variable is used for:

### Supabase Configuration
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: The anonymous key for client-side operations
- `VITE_SUPABASE_SERVICE_KEY`: The service role key for admin operations (keep this secure!)

### ConvertKit API Keys
- `VITE_CONVERTKIT_V4_API_KEY`: ConvertKit V4 API key
- `VITE_CONVERTKIT_V3_API_KEY`: ConvertKit V3 API key
- `VITE_CONVERTKIT_API_SECRET`: ConvertKit API secret

### ConvertKit Form IDs
- `VITE_CONVERTKIT_NEWSLETTER_FORM_ID`: ID for the newsletter form
- `VITE_CONVERTKIT_POPUP_FORM_ID`: ID for the popup form

### Microsoft Clarity
- `VITE_MICROSOFT_CLARITY_PROJECT_ID`: Microsoft Clarity tracking ID

### JotForm
- `VITE_JOTFORM_AGENT_ID`: JotForm agent ID for the chat widget

### Admin User
- `VITE_ADMIN_USER_ID`: Admin user ID (for development purposes only)
- `VITE_ADMIN_USER_EMAIL`: Admin user email (for development purposes only)

STAND ALONE page embed
<iframe id="JotFormIFrame-01960593248a7d43a80dbeba645716245d9a"
  title="Emmanuel: Appointment Scheduler" onload="window.parent.scrollTo(0,0)"
  allowtransparency="true" allow="geolocation; microphone; camera; fullscreen"
  src="https://agent.jotform.com/01960593248a7d43a80dbeba645716245d9a?embedMode=iframe&background=1&shadow=1"
  frameborder="0" style="
    min-width:100%;
    max-width:100%;
    height:688px;
    border:none;
    width:100%;
  " scrolling="no">
</iframe>
<script src='https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js'></script>
<script>
  window.jotformEmbedHandler("iframe[id='JotFormIFrame-01960593248a7d43a80dbeba645716245d9a']",
    "https://www.jotform.com")
</script>

Medium RSS FEED:
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[Stories by Marketing Lot on Medium]]></title>
    <description><![CDATA[Stories by Marketing Lot on Medium]]></description>
    <link>https://medium.com/@marketinglot-blog?source=rss</link>
    <image>
      <url>https://cdn-images-1.medium.com/fit/c/150/150/1*38QnFqMHXK22xnCHu7NbTg.png</url>
      <title>Stories by Marketing Lot on Medium</title>
      <link>https://medium.com/@marketinglot-blog?source=rss</link>
    </image>
    <generator>Medium</generator>
    <lastBuildDate>Tue, 15 Apr 2025 11:27:03 GMT</lastBuildDate>
    <atom:link href="https://medium.com/@marketinglot-blog/feed" rel="self" type="application/rss+xml"/>

    <item>
      <title><![CDATA[What Is Affiliate Marketing and How to make money with it.]]></title>
      <link>https://marketinglot-blog.medium.com/what-is-affiliate-marketing-and-how-to-make-money-with-it-2b154c038ff3</link>
      <guid isPermaLink="false">https://medium.com/p/2b154c038ff3</guid>
      <category><![CDATA[email-marketing-lists]]></category>
      <category><![CDATA[affiliate-marketing]]></category>
      <category><![CDATA[marketinglot]]></category>
      <category><![CDATA[digital-marketing]]></category>
      <category><![CDATA[affiliate-marketing-tips]]></category>
      <dc:creator><![CDATA[Marketing Lot]]></dc:creator>
      <pubDate>Thu, 23 Jun 2022 20:25:20 GMT</pubDate>
      <atom:updated>2022-06-23T20:25:20.021Z</atom:updated>
      <content:encoded><![CDATA[
        <figure>
          <img alt="" src="https://cdn-images-1.medium.com/max/1024/1*pvKwTqQLSqjeYq9ECXDVmg.png" />
        </figure>
        <h3>Introduction</h3>
        <p>Affiliate marketing is one way to ensure the money is coming in even while you’re away from your computer...</p>
      ]]></content:encoded>
    </item>

    <item>
      <title><![CDATA[The Ultimate Guide to CPA Marketing: Step by Step on Getting Started…]]></title>
      <link>https://marketinglot-blog.medium.com/the-ultimate-guide-to-cpa-marketing-how-to-make-money-and-get-more-leads-4cd8790959a</link>
      <guid isPermaLink="false">https://medium.com/p/4cd8790959a</guid>
      <category><![CDATA[marketing-tips]]></category>
      <category><![CDATA[marketinglot]]></category>
      <category><![CDATA[cpa-marketing]]></category>
      <category><![CDATA[marketing]]></category>
      <dc:creator><![CDATA[Marketing Lot]]></dc:creator>
      <pubDate>Sat, 11 Jun 2022 16:50:31 GMT</pubDate>
      <atom:updated>2022-06-17T22:20:55.481Z</atom:updated>
      <content:encoded><![CDATA[
        <figure>
          <img alt="" src="https://cdn-images-1.medium.com/max/1024/0*a1s7e3HL1IQmWgSX" />
        </figure>
        <p>How to make money with CPA Marketing? If you’re wondering how to become successful at CPA marketing, you’ve come to the right place...</p>
      ]]></content:encoded>
    </item>

  </channel>
</rss>
