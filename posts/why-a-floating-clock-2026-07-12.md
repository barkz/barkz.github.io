# Why a floating clock

Clocktastic started as a complaint. The menu bar clock is too small to
read from across the room, and every full-screen app hides it entirely.
That is the whole origin story.

## The rule we set first

A desktop clock has one job, and the failure mode is obvious: it becomes
another thing you have to manage. So the rule was written before any
code:

1. It never steals focus.
2. It never sits on top of what you are actually doing.
3. It is readable from three metres away, or it is pointless.

Rule three is why the type is so large, and why the default is a pixel
face rather than something delicate.

## Transparency turned out to be the hard part

Making a window float is easy. Making a floating window feel *calm* is
not. Our first build was opaque and it felt like a sticker slapped on the
desktop. The fix was an opacity slider — not because everyone will move
it, but because the right value depends entirely on your wallpaper.

The countdown came later, from watching ourselves use it. If you are
already glancing at a clock to see how much focus time is left, the clock
may as well count.

## Where it is going

Weather is in. Multiple time zones are in, because half the people we
showed it to asked for them within a minute. Everything else is waiting
until it earns its place.

December 15, 2026. It ships when it is actually done, and that date is
the promise we are making to ourselves.
