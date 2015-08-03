module.exports = {"404":"<h2 id=\"couldn-t-find-that-page\">Couldn&#39;t find that page</h2>\n<p>Sorry, this page doesn&#39;t seem to exist.</p>\n<h3 id=\"return-to-the-a-href-home-onclick-return-top-pub-sidebar-load-home-event-return-false-help-homepage-a-\">Return to the <a href=\"#home\"onclick=\"return top.pub.sidebar.load('home', event); return false;\">help homepage</a>.</h3>\n","adding-numbers":"<h2 id=\"adding-numbers\">Adding numbers</h2>\n<p>As well as drawing shapes, actions can be used for many other things.  For example: adding numbers. Type in this code:</p>\n<pre><code>write(add(1 2) 200 200 &quot;black&quot;)\n</code></pre><p>What happened?</p>\n<p>The <code>add</code> action was given <code>1</code> and <code>2</code> and it added them.  <code>add</code> gave back the answer, <code>3</code>, to the <code>write</code> action which wrote it on the screen.</p>\n<h3 id=\"-a-href-writing-text-onclick-return-top-pub-sidebar-load-writing-text-event-return-false-previous-a-div-class-next-a-href-naming-the-result-of-an-action-onclick-return-top-pub-sidebar-load-naming-the-result-of-an-action-event-return-false-naming-the-result-of-an-action-a-div-\"><a href=\"#writing-text\"onclick=\"return top.pub.sidebar.load('writing-text', event); return false;\">← Previous</a> <div class=\"next\"><a href=\"#naming-the-result-of-an-action\"onclick=\"return top.pub.sidebar.load('naming-the-result-of-an-action', event); return false;\">Naming the result of an action →</a></div></h3>\n","doing-an-action-a-lot-of-times":"<h2 id=\"doing-an-action-a-lot-of-times\">Doing an action a lot of times</h2>\n<p>When you reused the <code>number</code> name, you could focus on the adding, rather than the naming.  This will come in useful now.  You are going to create your first animation.  Type in the code below:</p>\n<pre><code>number: 1\n\nforever {\n  number: add(number 1)\n\n  clear-screen()\n  write(number 600 200 &quot;black&quot;)\n}\n</code></pre><p>What is happening here?</p>\n<p><code>1</code> is named <code>number</code>.  There is something about a <code>forever</code>, whatever that is.  <code>1</code> is added to <code>number</code> and the result, <code>2</code>, is named <code>number</code>.</p>\n<p>The <code>clear-screen</code> action clears the screen. (The screen is already clear, so this is pointless, but you&#39;ll see why that line is there in a second.)</p>\n<p><code>number</code> is written to the screen.</p>\n<p>This is where <code>forever</code> comes in.  The <code>forever</code> jumps the code back up to the line with the <code>add</code> action. Again, <code>1</code> is added to <code>number</code> and the result, <code>3</code>, is named <code>number</code>.</p>\n<p>The screen is cleared. So the old number that was written to the screen is cleared away. <code>number</code> is written to the screen again.  The <code>forever</code> jumps the code back...and so on.</p>\n<h3 id=\"running-your-code-step-by-step\">Running your code step by step</h3>\n<p>This progression of events is quite complicated.  You can use the Code Lauren program play controls to see a clearer picture of how your code runs.  Click <button class=\"example-pause-button\"></button> at the top of the page to make your program pause.  Now use <button class=\"example-step-backwards-button\"></button> and <button class=\"example-step-forwards-button\"></button> to see your code run step by step.</p>\n<h3 id=\"-a-href-reusing-a-name-onclick-return-top-pub-sidebar-load-reusing-a-name-event-return-false-previous-a-div-class-next-a-href-moving-an-oval-onclick-return-top-pub-sidebar-load-moving-an-oval-event-return-false-moving-an-oval-a-div-\"><a href=\"#reusing-a-name\"onclick=\"return top.pub.sidebar.load('reusing-a-name', event); return false;\">← Previous</a> <div class=\"next\"><a href=\"#moving-an-oval\"onclick=\"return top.pub.sidebar.load('moving-an-oval', event); return false;\">Moving an oval →</a></div></h3>\n","home":"<h2 id=\"learn-to-code-no-experience-necessary-\">Learn to code. No experience necessary.</h2>\n<p>Try changing <code>&quot;blue&quot;</code> to <code>&quot;red&quot;</code> in the code on the left.</p>\n<p>Try some other colors.</p>\n<h3 id=\"-div-class-next-a-href-oval-onclick-return-top-pub-sidebar-load-oval-event-return-false-continue-the-tutorial-a-div-\"><div class=\"next\"><a href=\"#oval\"onclick=\"return top.pub.sidebar.load('oval', event); return false;\">Continue the tutorial →</a></div></h3>\n","moving-an-oval":"<h2 id=\"moving-an-oval\">Moving an oval</h2>\n<p>In the previous lesson, you did your first animation. But animating a shape is even more fun. Let&#39;s do that.  Type in this code:</p>\n<pre><code>left-dist: 1\n\nforever {\n  left-dist: add(left-dist 0.1)\n\n  clear-screen()\n  draw-oval(left-dist 300 30 30 &quot;filled&quot; &quot;blue&quot;)\n}\n</code></pre><p>This code is extremely similar to the code in the previous lesson.  The main difference is that the number that gets changed is used to describe the distance of an oval from the left of the screen.</p>\n<p>Again, if you&#39;re not sure how this code works, use the play controls at the top of the screen. Walk through the code step by step to see the sequence of events.</p>\n<h3 id=\"next\">Next</h3>\n<p>That&#39;s the end of this tutorial. You&#39;ve covered a lot. I&#39;ll publish more tutorials very soon. Please send feedback on things that could be better about Code Lauren to <a href=\"mailto:mary@maryrosecook.com\">mary@maryrosecook.com</a></p>\n<h3 id=\"-a-href-doing-an-action-a-lot-of-times-onclick-return-top-pub-sidebar-load-doing-an-action-a-lot-of-times-event-return-false-previous-a-div-class-next-a-href-home-onclick-return-top-pub-sidebar-load-home-event-return-false-home-a-div-\"><a href=\"#doing-an-action-a-lot-of-times\"onclick=\"return top.pub.sidebar.load('doing-an-action-a-lot-of-times', event); return false;\">← Previous</a> <div class=\"next\"><a href=\"#home\"onclick=\"return top.pub.sidebar.load('home', event); return false;\">Home</a></div></h3>\n","naming-the-result-of-an-action":"<h2 id=\"naming-the-result-of-an-action\">Naming the result of an action</h2>\n<p>Type in this code:</p>\n<pre><code>addition-answer: add(1 2)\nwrite(addition-answer 600 200 &quot;black&quot;)\n</code></pre><p>This is interesting. You created a new number, <code>3</code>, by giving <code>1</code> and <code>2</code> to the <code>add</code> action.  You then named the new number <code>addition-answer</code>.</p>\n<h3 id=\"-a-href-adding-numbers-onclick-return-top-pub-sidebar-load-adding-numbers-event-return-false-previous-a-div-class-next-a-href-reusing-a-name-onclick-return-top-pub-sidebar-load-reusing-a-name-event-return-false-reusing-a-name-a-div-\"><a href=\"#adding-numbers\"onclick=\"return top.pub.sidebar.load('adding-numbers', event); return false;\">← Previous</a> <div class=\"next\"><a href=\"#reusing-a-name\"onclick=\"return top.pub.sidebar.load('reusing-a-name', event); return false;\">Reusing a name →</a></div></h3>\n","naming-things":"<h2 id=\"naming-things\">Naming things</h2>\n<p>Earlier, I suggested you make a line of ovals. You might have noticed that you were repeating numbers. For another example, type in this code:</p>\n<pre><code>draw-oval(200 200 30 40 &quot;filled&quot; &quot;blue&quot;)\ndraw-oval(250 200 30 40 &quot;filled&quot; &quot;red&quot;)\n</code></pre><p><code>200</code>, the description of how far down to draw an oval, appears twice.  <code>30</code>, the width of the ovals, appears twice. The height appears twice, too.</p>\n<h3 id=\"name-the-distance-from-the-top\">Name the distance from the top</h3>\n<p>You can name the distance of the ovals from the top like this:</p>\n<pre><code>top-dist: 200\n</code></pre><p>You can then use the name in place of the distance.  Notice how the code below sets <code>top-dist</code> to <code>200</code> and replaces the <code>200</code>s with <code>top-dist</code> in the <code>draw-oval</code> actions.</p>\n<pre><code>top-dist: 200\n\ndraw-oval(200 top-dist 30 40 &quot;filled&quot; &quot;blue&quot;)\ndraw-oval(250 top-dist 30 40 &quot;filled&quot; &quot;red&quot;)\n</code></pre><h3 id=\"change-the-distance-from-the-top\">Change the distance from the top</h3>\n<p>Change the number that <code>top-dist</code> describes. For example, you could change it to <code>300</code>.</p>\n<pre><code>top-dist: 300\n\ndraw-oval(200 top-dist 30 40 &quot;filled&quot; &quot;blue&quot;)\ndraw-oval(250 top-dist 30 40 &quot;filled&quot; &quot;red&quot;)\n</code></pre><h3 id=\"naming-something-makes-it-easy-to-change\">Naming something makes it easy to change</h3>\n<p>Notice how easy it was to move both ovals at once.  You needed to change just one number.</p>\n<h3 id=\"naming-something-describes-it\">Naming something describes it</h3>\n<p>Notice how easy it was to figure out which number to change. Names describe the meaning of the numbers they represent.</p>\n<h3 id=\"name-the-width\">Name the width</h3>\n<p>Add a name for the width and use it in your <code>draw-oval</code> descriptions.</p>\n<h3 id=\"-a-href-rectangle-onclick-return-top-pub-sidebar-load-rectangle-event-return-false-previous-a-div-class-next-a-href-writing-text-onclick-return-top-pub-sidebar-load-writing-text-event-return-false-writing-text-a-div-\"><a href=\"#rectangle\"onclick=\"return top.pub.sidebar.load('rectangle', event); return false;\">← Previous</a> <div class=\"next\"><a href=\"#writing-text\"onclick=\"return top.pub.sidebar.load('writing-text', event); return false;\">Writing text →</a></div></h3>\n","oval":"<h2 id=\"draw-an-oval\">Draw an oval</h2>\n<p>Let&#39;s write your first program.</p>\n<p>Delete all the code in the area on the left.  Type in the code below.</p>\n<pre><code>draw-oval(100 200 30 40 &quot;filled&quot; &quot;blue&quot;)\n</code></pre><p>Do you see a blue oval?</p>\n<h3 id=\"make-the-oval-an-outline\">Make the oval an outline</h3>\n<p>Try changing <code>&quot;filled&quot;</code> to <code>&quot;unfilled&quot;</code>.</p>\n<h3 id=\"change-the-position-and-size\">Change the position and size</h3>\n<p>Try changing the numbers. They describe:</p>\n<ol>\n<li>How far to the right the oval is.</li>\n<li>How far down the oval is.</li>\n<li>How wide wide the oval is.</li>\n<li>How tall the oval is.</li>\n</ol>\n<p>Which one is which?</p>\n<p>Do the numbers that describe the position of the oval indicate its middle or top left?</p>\n<h3 id=\"-a-href-home-onclick-return-top-pub-sidebar-load-home-event-return-false-previous-a-div-class-next-a-href-ovals-onclick-return-top-pub-sidebar-load-ovals-event-return-false-draw-lots-of-ovals-a-div-\"><a href=\"#home\"onclick=\"return top.pub.sidebar.load('home', event); return false;\">← Previous</a> <div class=\"next\"><a href=\"#ovals\"onclick=\"return top.pub.sidebar.load('ovals', event); return false;\">Draw lots of ovals →</a></div></h3>\n","ovals":"<h2 id=\"draw-lots-of-ovals\">Draw lots of ovals</h2>\n<p>Draw some more ovals. You can do this by adding more lines of code to your program. For example:</p>\n<pre><code>draw-oval(100 300 30 40 &quot;filled&quot; &quot;pink&quot;)\ndraw-oval(100 400 30 40 &quot;filled&quot; &quot;green&quot;)\n</code></pre><h3 id=\"arrange-the-ovals-in-a-shape\">Arrange the ovals in a shape</h3>\n<p>Try and make a line of ovals.</p>\n<h3 id=\"-a-href-oval-onclick-return-top-pub-sidebar-load-oval-event-return-false-previous-a-div-class-next-a-href-rectangle-onclick-return-top-pub-sidebar-load-rectangle-event-return-false-draw-a-rectangle-a-div-\"><a href=\"#oval\"onclick=\"return top.pub.sidebar.load('oval', event); return false;\">← Previous</a> <div class=\"next\"><a href=\"#rectangle\"onclick=\"return top.pub.sidebar.load('rectangle', event); return false;\">Draw a rectangle →</a></div></h3>\n","rectangle":"<h2 id=\"draw-a-rectangle\">Draw a rectangle</h2>\n<p>Type in the code below to draw a rectangle.</p>\n<p>When I say &quot;type in the code&quot;, I really mean it. There is a world of difference between typing in the code and either copying and pasting it or just taking my word for what the code does.  Learning to program is about experimenting.  Play around.  Try things I haven&#39;t suggested. Guess what some code will do, then see if you&#39;re right.</p>\n<p>Go ahead and type this in:</p>\n<pre><code>draw-rectangle(100 200 50 150 &quot;filled&quot; &quot;gray&quot;)\n</code></pre><h3 id=\"ordering-the-items-in-the-description-of-a-shape\">Ordering the items in the description of a shape</h3>\n<p>In the line of code you wrote to describe the rectangle, swap the places of <code>100</code> and <code>&quot;gray&quot;</code>.  The line of code should now look like this:</p>\n<pre><code>draw-rectangle(&quot;gray&quot; 200 50 150 &quot;filled&quot; 100)\n</code></pre><p>What happened?</p>\n<p>Yep, the rectangle is gone. Ordering matters. <code>draw-rectangle</code> expected the first item it its description to be a number that says how far from the left the rectangle is.  Instead, it got a color. Without understanding all the pieces of the description, it couldn&#39;t do its job.</p>\n<h3 id=\"-a-href-ovals-onclick-return-top-pub-sidebar-load-ovals-event-return-false-previous-a-div-class-next-a-href-naming-things-onclick-return-top-pub-sidebar-load-naming-things-event-return-false-naming-things-a-div-\"><a href=\"#ovals\"onclick=\"return top.pub.sidebar.load('ovals', event); return false;\">← Previous</a> <div class=\"next\"><a href=\"#naming-things\"onclick=\"return top.pub.sidebar.load('naming-things', event); return false;\">Naming things →</a></div></h3>\n","reusing-a-name":"<h2 id=\"reusing-a-name\">Reusing a name</h2>\n<h3 id=\"repeated-additions\">Repeated additions</h3>\n<p>Type in this code:</p>\n<pre><code>first-number: 1\nwrite(first-number 600 200 &quot;black&quot;)\n\nsecond-number: add(first-number 2)\nwrite(second-number 600 230 &quot;black&quot;)\n</code></pre><p>You created <code>second-number</code> by giving <code>first-number</code> and <code>2</code> to the <code>add</code> action.  That is, you gave a new name to a number you created using an old name.</p>\n<h3 id=\"reusing-a-name\">Reusing a name</h3>\n<p>But why bother making a new name? Why not just reuse the old one? Type in this code:</p>\n<pre><code>number: 1\nwrite(number 600 200 &quot;black&quot;)\n\nnumber: add(number 2)\nwrite(number 600 230 &quot;black&quot;)\n</code></pre><p>Do you see how <code>number</code> was reused as the name of the result of adding <code>number</code> and <code>2</code>? Why is that useful? Let&#39;s find out...</p>\n<h3 id=\"-a-href-naming-the-result-of-an-action-onclick-return-top-pub-sidebar-load-naming-the-result-of-an-action-event-return-false-previous-a-div-class-next-a-href-doing-an-action-a-lot-of-times-onclick-return-top-pub-sidebar-load-doing-an-action-a-lot-of-times-event-return-false-doing-an-action-a-lot-of-times-a-div-\"><a href=\"#naming-the-result-of-an-action\"onclick=\"return top.pub.sidebar.load('naming-the-result-of-an-action', event); return false;\">← Previous</a> <div class=\"next\"><a href=\"#doing-an-action-a-lot-of-times\"onclick=\"return top.pub.sidebar.load('doing-an-action-a-lot-of-times', event); return false;\">Doing an action a lot of times →</a></div></h3>\n","writing-text":"<h2 id=\"writing-text\">Writing text</h2>\n<p>You can write text on the screen with the <code>write</code> action.  Type in this code:</p>\n<pre><code>write(&quot;hi&quot; 200 200 &quot;black&quot;)\n</code></pre><p>Using the <code>write</code> action is a super-easy way to look at the number that a name is pointed at.  For example, type in this code:</p>\n<pre><code>top-dist: 200\n\nwrite(top-dist 200 200 &quot;black&quot;)\n</code></pre><p>Why would you want to do this? You&#39;ll see!</p>\n<h3 id=\"-a-href-naming-things-onclick-return-top-pub-sidebar-load-naming-things-event-return-false-previous-a-div-class-next-a-href-adding-numbers-onclick-return-top-pub-sidebar-load-adding-numbers-event-return-false-adding-numbers-a-div-\"><a href=\"#naming-things\"onclick=\"return top.pub.sidebar.load('naming-things', event); return false;\">← Previous</a> <div class=\"next\"><a href=\"#adding-numbers\"onclick=\"return top.pub.sidebar.load('adding-numbers', event); return false;\">Adding numbers →</a></div></h3>\n"}