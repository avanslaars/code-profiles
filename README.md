# "Profiles" for VS Code

Working as a developer as well as creating screencasts and conducting workshops means I often need to make changes to my VS Code settings to increase the font size, make the colors easy to see on a projector screen and disabling "noisy" extensions that are very useful for working as a dev, but get in the way when teaching.

Luckily, you can launch VS Code with command line flags to load settings and extensions from a non-default location.

Each folder in this repo represents one of those directories, which I refer to as "profiles" for lack of a better term.

I launch each profile using an alias that I create in my `.zshrc`.

For example, this repo lives in `~/code_profiles` and the command to launch my `egghead` settings is:

```sh
code --extensions-dir ~/code_profiles/egghead/exts --user-data-dir ~/code_profiles/egghead/data
```

The alias in my `.zshrc` looks like:

```sh
alias teach="code --extensions-dir ~/code_profiles/egghead/exts --user-data-dir ~/code_profiles/egghead/data"
```

And I can run that with a path like:

```sh
teach ~/projects/lesson
```