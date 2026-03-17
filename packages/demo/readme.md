# How it kinda works

Basically we rely on the `$extends` to help act as a contract/interface whatever i.e. one description Then you override what changes. Will inherit the default values otherwise. Same goes for theme files, just override what changes.

This removes the alias step which is what I really did not like.

The token count output will be slighly off as we don't techincally generate the contract tokens, we exlude them from output.