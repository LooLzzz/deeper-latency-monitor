from . import app


@app.get('/')
def root():
    return {'Message': 'Hello World'}
