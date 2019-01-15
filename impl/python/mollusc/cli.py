from click import command, group

@group()
def main():
    pass

@main.command()
def yay():
    print('yay')
